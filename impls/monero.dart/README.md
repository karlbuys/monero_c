# monero.dart

## Usage

```
cwlws:
  git:
    url: https://github.com/karlbuys/monero_c
    ref: main
    path: impls/monero.dart
```

```dart
import 'package: monero/monero.dart' as cwlws;

void main() {
    final wm = cwlws.WalletManagerFactory_getWalletManager();
    final w = cwlws.WalletManager_openWallet({...});
    print(cwlws.Wallet_balance(w));
}
```

If you need more advanced usage, to for example use the code in an isolate, some workarounding is required **NOTE: from now on you manage your own memory partialy**.

Simplest example is this:

```dart
final addr = w.address; 
final height = await Isolate.run(() async {
    return monero.lib.CWLWS_Wallet_daemonBlockChainHeight(Pointer.fromAddress(addr));
});
```

It gets even funnier when sending a transaction

```dart
final ptrAddr = xmrwPtr!.address;
final dstAddrPtr = txData.recipients!.first.address.toNativeUtf8().address;
final paymentAddrPtr = ''.toNativeUtf8().address;
final preferredInputsPtr = ''.toNativeUtf8().address;
final separatorPtr = ''.toNativeUtf8().address;
final amount = txData.recipients!.first.amount.raw.toInt();
final txPtrAddr = await Isolate.run(
    () {
        monero.lib ??= MoneroC(DynamicLibrary.open(monero.libPath));
        final txPtr = monero.lib!.CWLWS_Wallet_createTransaction(
            Pointer.fromAddress(ptrAddr), 
            Pointer.fromAddress(dstAddrPtr).cast(), 
            Pointer.fromAddress(paymentAddrPtr).cast(), 
            amount, 0, 0, 0, 
            Pointer.fromAddress(preferredInputsPtr).cast(), 
            Pointer.fromAddress(separatorPtr).cast(),
        );
        // Nothing hits better than managing memory in GC language :)
        return txPtr.address;
    },
    debugName: 'CWLWS_Wallet_createTransaction',
);

final txPtr = Pointer.fromAddress(txPtrAddr).cast<Void>();
calloc.free(Pointer.fromAddress(dstAddrPtr));
calloc.free(Pointer.fromAddress(paymentAddrPtr));
calloc.free(Pointer.fromAddress(preferredInputsPtr));
calloc.free(Pointer.fromAddress(separatorPtr));
```

Async api will be made as a part of the generator update, too much effort under current design.

## Building

```bash
$ bash update_bindings.sh
$ # you are done, this is a library, what more did you expect?
```