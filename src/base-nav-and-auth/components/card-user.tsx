import { useNavigate } from '@tanstack/react-router';
import { Laptop, Loader2, LogOut, PhoneIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UAParser } from 'ua-parser-js';
import { CardUserChangeUser } from '~/base-nav-and-auth/components/card-user-change-user';
import { AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { type AuthClient, authClient } from '~/lib/auth/auth-client';
import { getInitials } from '../client/get-initials';
import { useAuthHelpers, useLogout } from '../hooks/auth-hooks';
import { DialogChangePassword } from './dialog-change-password';

// Validation schemas
/*
const qrCodePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const twoFactorPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const twoFactorOtpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only digits'),
});
*/

export default function CardUser(props: { activeSessions: AuthClient['$Infer']['Session']['session'][] }) {
  const logout = useLogout();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const {
    // getTotpUri,
    // enableTwoFactor,
    // disableTwoFactor,
    // verifyTotpForEnable,
    sendVerificationEmail,
    signOut,
    revokeSession,
  } = useAuthHelpers();
  const [isTerminating, setIsTerminating] = useState<string>();
  // TODO // Enable two factor authentication
  /*
  const [twoFactorDialog, setTwoFactorDialog] = useState<boolean>(false);
  const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState<string>('');

  // Form for QR code password verification
  const qrCodeForm = useAppForm({
    defaultValues: {
      password: '',
    },
    validators: {
      onChange: ({ value }) => {
        const result = qrCodePasswordSchema.safeParse(value);
        if (!result.success) {
          return result.error.issues;
        }
        return;
      },
    },
    onSubmit: ({ value }) => {
      getTotpUri.mutate(
        { password: value.password },
        {
          onSuccess: (data) => {
            setTwoFactorVerifyURI(data.data?.totpURI || '');
            qrCodeForm.setFieldValue('password', '');
          },
          onError: (error: Error) => {
            toast.error(error.message);
          },
        }
      );
    },
  });

  // Form for two-factor enable/disable
  const twoFactorForm = useAppForm({
    defaultValues: {
      password: '',
      otp: '',
    },
    validators: {
      onChange: ({ value }) => {
        if (twoFactorVerifyURI) {
          // When showing OTP input
          const result = twoFactorOtpSchema.safeParse({ otp: value.otp });
          if (!result.success) {
            return result.error.issues;
          }
        } else {
          // When showing password input
          const result = twoFactorPasswordSchema.safeParse({
            password: value.password,
          });
          if (!result.success) {
            return result.error.issues;
          }
        }
        return;
      },
    },
    onSubmit: ({ value }) => {
      if (session?.user.twoFactorEnabled) {
        // Disable 2FA
        disableTwoFactor.mutate(
          { password: value.password },
          {
            onSuccess: () => {
              toast('2FA disabled successfully');
              setTwoFactorDialog(false);
              twoFactorForm.setFieldValue('password', '');
            },
            onError: (error: Error) => {
              toast.error(error.message);
            },
          }
        );
      } else if (twoFactorVerifyURI) {
        // Verify OTP to enable 2FA
        verifyTotpForEnable.mutate(
          { code: value.otp },
          {
            onSuccess: () => {
              toast('2FA enabled successfully');
              setTwoFactorVerifyURI('');
              twoFactorForm.setFieldValue('otp', '');
              twoFactorForm.setFieldValue('password', '');
              setTwoFactorDialog(false);
            },
            onError: (error: Error) => {
              twoFactorForm.setFieldValue('otp', '');
              toast.error(error.message);
            },
          }
        );
      } else {
        // Enable 2FA - get TOTP URI
        enableTwoFactor.mutate(
          { password: value.password },
          {
            onSuccess: (data) => {
              setTwoFactorVerifyURI(data.data?.totpURI || '');
            },
            onError: (error) => {
              toast.error(error.message);
            },
          }
        );
      }
    },
  });
  */

  const handleSendVerificationEmail = async () => {
    // TODO // Send server verification email
    // sendVerificationEmail.mutate(
    //   {
    //     email: session?.user.email || '',
    //   },
    //   {
    //     onError(error) {
    //       toast.error(error.message);
    //     },
    //     onSuccess() {
    //       toast.success('Verification email sent successfully');
    //     },
    //   }
    // );
  };

  const handleRevokeSession = async (item: AuthClient['$Infer']['Session']['session']) => {
    setIsTerminating(item.id);
    const res = await revokeSession.mutateAsync({
      token: item.token,
    });

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success('Session terminated successfully');
    }
    if (item.id === session?.session?.id) {
      signOut.mutate(undefined, {
        onSuccess() {
          setIsTerminating(undefined);
          navigate({ to: '/' });
        },
      });
    }
    setIsTerminating(undefined);
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User</CardTitle>
        {/*
          <LanguageSwitch />
        */}
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage alt="Avatar" className="object-cover" src={session?.user.image || '#'} />
              <AvatarFallback>{getInitials(session?.user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-medium text-sm leading-none">{session?.user.name}</p>
              <p className="text-sm">{session?.user.email}</p>
            </div>
          </div>
          <CardUserChangeUser />
        </div>

        {session?.user.emailVerified ? null : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <AlertTitle>Verify Email</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Please verify your email address. Check your inbox for the verification email. If you haven't received
                the email, click the button below to resend.
              </AlertDescription>
              <Button className="mt-2" onClick={handleSendVerificationEmail} size="sm" variant="secondary">
                {sendVerificationEmail.isPending ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="flex w-max flex-col gap-1 border-l-2 px-2">
          <p className="font-medium text-xs">Active Sessions</p>
          {props?.activeSessions
            ?.filter((item) => item.userAgent)
            .map((item) => {
              return (
                <div key={item.id}>
                  <div className="flex items-center gap-2 font-medium text-black text-sm dark:text-white">
                    {new UAParser(item.userAgent || '').getDevice().type === 'mobile' ? (
                      <PhoneIcon />
                    ) : (
                      <Laptop size={16} />
                    )}
                    {new UAParser(item.userAgent || '').getOS().name},{' '}
                    {new UAParser(item.userAgent || '').getBrowser().name}
                    <Button
                      className="min-w-25 cursor-pointer"
                      onClick={() => handleRevokeSession(item)}
                      variant="outline"
                    >
                      {isTerminating === item.id ? (
                        <Loader2 className="animate-spin" size={15} />
                        // biome-ignore lint/style/noNestedTernary: Allow
                      ) : item.id === session?.session?.id ? (
                        'Sign Out'
                      ) : (
                        'Terminate'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
        {
          // TODO // Add support for passkeys
          /*
        <div className="flex flex-wrap items-center justify-between gap-2 border-y py-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm">{t('PASSKEYS')}</p>
            <div className="flex flex-wrap gap-2">
              <AddPasskey />
              <ListPasskeys />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm">{t('TWO_FACTOR')}</p>
            <div className="flex gap-2">
              {!!session?.user.twoFactorEnabled && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2" variant="outline">
                      <QrCode size={16} />
                      <span className="text-xs md:text-sm">{t('SCAN_QR_CODE')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-11/12 sm:max-w-106" >
                    <DialogHeader>
                      <DialogTitle>{t('SCAN_QR_CODE')}</DialogTitle>
                      <DialogDescription>{t('SCAN_QR_DESC')}</DialogDescription>
                    </DialogHeader>

                    {twoFactorVerifyURI ? (
                      <>
                        <div className="flex items-center justify-center">
                          <QRCode value={twoFactorVerifyURI} />
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-muted-foreground text-sm">{t('COPY_URI')}</p>
                          <CopyToClipboardButton textToCopy={twoFactorVerifyURI} />
                        </div>
                      </>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          qrCodeForm.handleSubmit();
                        }}
                      >
                        <div className="flex flex-col gap-2">
                          <qrCodeForm.AppField
                            children={(field) => (
                              <FormFieldPassword field={field} label="" placeholder={t('ENTER_PASSWORD')} />
                            )}
                            name="password"
                          />
                          <qrCodeForm.Subscribe
                            children={([canSubmit, isSubmitting]) => {
                              const isLoading = isSubmitting || getTotpUri.isPending;

                              return (
                                <Button disabled={!canSubmit || isLoading} type="submit">
                                  {isLoading ? <Loader2 className="animate-spin" size={15} /> : t('SHOW_QR_CODE')}
                                </Button>
                              );
                            }}
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                          />
                        </div>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              )}
              <Dialog onOpenChange={setTwoFactorDialog} open={twoFactorDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2" variant={session?.user.twoFactorEnabled ? 'destructive' : 'outline'}>
                    {session?.user.twoFactorEnabled ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                    <span className="text-xs md:text-sm">
                      {session?.user.twoFactorEnabled ? t('DISABLE_2FA') : t('ENABLE_2FA')}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-11/12 sm:max-w-106" >
                  <DialogHeader>
                    <DialogTitle>{session?.user.twoFactorEnabled ? t('DISABLE_2FA') : t('ENABLE_2FA')}</DialogTitle>
                    <DialogDescription>
                      {session?.user.twoFactorEnabled ? t('DISABLE_2FA_DESC') : t('ENABLE_2FA_DESC')}
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      twoFactorForm.handleSubmit();
                    }}
                  >
                    {twoFactorVerifyURI ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center">
                          <QRCode value={twoFactorVerifyURI} />
                        </div>
                        <Label>{t('SCAN_QR_DESC')}</Label>
                        <twoFactorForm.AppField
                          children={(field) => <FormField field={field} label="" placeholder={t('ENTER_OTP')} />}
                          name="otp"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <twoFactorForm.AppField
                          children={(field) => (
                            <FormFieldPassword field={field} label={'Password'} placeholder={'Password'} />
                          )}
                          name="password"
                        />
                      </div>
                    )}
                    <DialogFooter>
                      <twoFactorForm.Subscribe
                        children={([canSubmit, isSubmitting]) => {
                          const isLoading =
                            isSubmitting ||
                            disableTwoFactor.isPending ||
                            enableTwoFactor.isPending ||
                            verifyTotpForEnable.isPending;

                          return (
                            <Button disabled={!canSubmit || isLoading} type="submit">
                              {isLoading ? (
                                <Loader2 className="animate-spin" size={15} />
                              ) : session?.user.twoFactorEnabled ? (
                                t('DISABLE_2FA')
                              ) : (
                                t('ENABLE_2FA')
                              )}
                            </Button>
                          );
                        }}
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                      />
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        */
        }
      </CardContent>
      <CardFooter className="items-center justify-between gap-2">
        <DialogChangePassword />
        <Button
          className="z-10 gap-2"
          disabled={logout.isPending}
          onClick={() => {
            // TODO // Restore sign out navigate code?
            // setIsSignOut(true);
            // await authClient.signOut({
            //   fetchOptions: {
            //     onSuccess() {
            //       navigate({ to: "/" });
            //     },
            //   },
            // });
            // setIsSignOut(false);
            logout.mutate();
          }}
          variant="secondary"
        >
          <span className="text-sm">
            {logout.isPending ? (
              <Loader2 className="animate-spin" size={15} />
            ) : (
              <div className="flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </div>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
